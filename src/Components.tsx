/**
 * Components Library
 * ------------------
 * A very basic, work-in-progress UI component framework/abstraction whose
 * central purpose is to enumerate and implement a basic component for each
 * of the ARIA roles available in React.
 * 
 * Basic Overload:
 
interface RowProps extends HTMLAttributes<HTMLElement> {
  row: number;
}
const Row = (({ row, className, children, ...rest }: RowProps) => (
  <GridRow
    role="row"
    aria-label={`Row ${row}`}
    className={`row ${className}`}
    data-testid={`row_${row}`}
    {...rest}>
    <>{children}</>
  </GridRow>
))

interface GridCellProps extends HTMLAttributes<HTMLElement> {
  row: number;
  col: number;
}
const Square = ({ row, col, ...rest }: GridCellProps) => {
  return (
    <GridCell>
      <button
        aria-label={`Cell ${row}.${col}`}
        data-testid={`cell${row}.${col}`}
        {...rest}
        className={`cell`}>
        {{ ...rest }.children}
      </button>
    </GridCell>);
    
 ...

 <Application>
      <Grid>
        {
          board.map((rowData: Cell[], row: number) => (
            <GridRow>
              {
                rowData.map((cell, col) => (
                  <Cell>
                    {CLJ.str(cell)}
                  </Cell>
                ))
              }
            </GridRow>
          ))
        }
      </Grid>
      <DebugDialog>
        { CLJ.pprint(board) }
      </DebugDialog>
    </Application>   
 * 
 */

    import React, { ReactNode, ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes, AnchorHTMLAttributes, ImgHTMLAttributes, TableHTMLAttributes, TdHTMLAttributes, DialogHTMLAttributes, useState } from 'react';


    interface ARIAProps extends HTMLAttributes<HTMLElement> {
      'aria-label'?: string;
      'aria-labelledby'?: string;
      'aria-describedby'?: string;
      'aria-haspopup'?: boolean | "false" | "true" | "menu" | "listbox" | "tree" | "grid" | "dialog" | undefined;
      'aria-pressed'?: boolean | "false" | "true" | "mixed"
      'data-testid'?: string;
      className?: string;
      children?: ReactNode;
      data?: any
    }
    
    interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> { }
    interface InputProps extends InputHTMLAttributes<HTMLInputElement> { }
    interface AnchorProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
      'alt': string;
      'label': string;
    }
    interface ImgProps extends ImgHTMLAttributes<HTMLImageElement> { 
      'alt': string;
    }
    interface TableProps extends TableHTMLAttributes<HTMLTableElement> { }
    interface TableDataProps extends TdHTMLAttributes<HTMLElement> { }
    interface ComboboxProps extends ARIAProps {
      'list': any[];
      'id': string;
      ariaControls: string;
      ariaExpanded:boolean;
    }
    interface RegionProps extends ARIAProps {
      ariaControls: string;
      ariaValuenow:boolean;
    }
    interface ScrollbarProps extends ARIAProps {
      'list': any[];
      'id': string;
      ariaControls: string;
      ariaValuenow:number;
    }
    interface TreeItemProps extends ARIAProps {
      ariaSelected: boolean;
    }
    
    export function Alert(props: ARIAProps) {
      return <div role="alert" {...props} />;
    }
    
    export function AlertDialog(props: ARIAProps) {
      return <div role="alertdialog" {...props} />;
    }
    
    export function Application(props: ARIAProps) {
      return (
        <div role="application"
          aria-label="Application"
          className={`app ${props.className}`}
          data-testid="app"
          {...props}>
          {props.children}
        </div>);
    }
    
    export function Article(props: ARIAProps) {
      return <article {...props} />;
    }
    
    export function Banner(props: ARIAProps) {
      return <header role="banner" {...props} />;
    }
    
    export function Button(props: ButtonProps) {
      return <button {...props} />;
    }
    
    export function Cell(props: ARIAProps) {
      return <div role="cell" {...props} />;
    }
    
    export function Checkbox(props: InputProps) {
      return <input type="checkbox" {...props} />;
    }
    
    export function ColumnHeader(props: ARIAProps) {
      return <th scope="col" {...props} />;
    }
    
    export function Combobox({ id, list, ariaControls, ariaExpanded, ...rest }: ComboboxProps) {
      return (
        <>
          <input type="text" list={id} role="combobox" aria-controls={ariaControls} aria-expanded={ariaExpanded} {...rest} />
          <datalist id={id}>
            { list.map((item) => ( <option>{item}</option> )) }
          </datalist>
        </>
      );
    }
    
    export function Complementary(props: ARIAProps) {
      return <aside {...props} />;
    }
    
    export function ContentInfo(props: ARIAProps) {
      return <footer role="contentinfo" {...props} />;
    }
    
    export function DefinitionList(props: ARIAProps) {
      return <dl {...props} />;
    }
    
    export function DefinitionTerm(props: ARIAProps) {
      return <dt {...props} />;
    }
    
    export function DefinitionDescription(props: ARIAProps) {
      return <dd {...props} />;
    }
    
    export function Dialog(props: ARIAProps) {
      return <dialog {...props} />;
    }
    
    export function Directory(props: ARIAProps) {
      return <div role="directory" {...props} />;
    }
    
    export function Document(props: ARIAProps) {
      return <main role="document" {...props} />;
    }
    
    export function Feed(props: ARIAProps) {
      return <div role="feed" {...props} />;
    }
    
    export function Figure(props: ARIAProps) {
      return <figure role="figure" {...props} />;
    }
    
    export function Form(props: ARIAProps) {
      return <form {...props} />;
    }
    
    export function Grid(props: ARIAProps) {
      return <div role="grid" {...props} />;
    }
    
    export function GridRow(props: ARIAProps) {
      return <div role="row" {...props} />;
    }
    
    export function GridCell(props: ARIAProps) {
      return <div role="gridcell" {...props} />;
    }
    
    export function Group(props: ARIAProps) {
      return <fieldset role="group" {...props} />;
    }
    
    export function Img({alt, ...rest}: ImgProps) {
      return <img alt={alt} {...rest} />;
    }
    
    export function Link({label, ...rest}: AnchorProps) {
      return <a role="link" aria-label='label' {...rest} />;
    }
    
    export function List(props: ARIAProps) {
      return <ul {...props} />;
    }
    
    export function ListBox(props: ARIAProps) {
      return <div role="listbox" {...props} />;
    }
    
    export function ListItem(props: ARIAProps) {
      return <li {...props} />;
    }
    
    export function Log(props: ARIAProps) {
      return <div role="log" {...props} />;
    }
    
    export function Main(props: ARIAProps) {
      return <main role="main" {...props} />;
    }
    
    export function Marquee(props: ARIAProps) {
      return <div role="marquee" {...props} />;
    }
    
    export function Menu(props: ARIAProps) {
      return <nav role="menu" {...props} />;
    }
    
    export function MenuBar(props: ARIAProps) {
      return <nav role="menubar" {...props} />;
    }
    
    export function MenuItem(props: ARIAProps) {
      return <div role="menuitem" {...props} />;
    }
    
    export function MenuItemCheckbox({checked, ...rest}: InputProps) {
      return <input aria-checked={checked} type="checkbox" role="menuitemcheckbox" {...rest} />;
    }
    
    export function MenuItemRadio({checked, ...rest}: InputProps) {
      return <input aria-checked={checked} type="radio" role="menuitemradio" {...rest} />;
    }
    
    export function Navigation(props: ARIAProps) {
      return <nav role="navigation" {...props} />;
    }
    
    export function None(props: ARIAProps) {
      return <div role="none" {...props} />;
    }
    
    export function Note(props: ARIAProps) {
      return <aside role="note" {...props} />;
    }
    
    export function Option(props: ARIAProps) {
      return <option {...props} />;
    }
    
    export function Presentation(props: ARIAProps) {
      return <div role="presentation" {...props} />;
    }
    
    export function ProgressBar(props: ARIAProps) {
      return <progress {...props} />;
    }
    
    export function Radio(props: InputProps) {
      return <input type="radio" {...props} />;
    }
    
    export function RadioGroup(props: ARIAProps) {
      return <fieldset role="radiogroup" {...props} />;
    }
    
    export function Region({ariaControls, ariaValuenow, ...rest}: RegionProps) {
      return <section {...rest} />;
    }
    
    export function Row(props: ARIAProps) {
      return <div role="row" {...props} />;
    }
    
    export function RowGroup(props: ARIAProps) {
      return <div role="rowgroup" {...props} />;
    }
    
    export function RowHeader(props: ARIAProps) {
      return <div role="rowheader" {...props} />;
    }
    
    
    /**
     * Sidebar
     * 
     * Notional usage:
     
        <aside id="sidebar">
        <section id="widget_1"></section>
        <section id="widget_2"></section>
        <section id="widget_3"></section>
        </aside>
    
     * @param props 
     * @returns 
     */
    export function Sidebar(props: ARIAProps) {
      return <aside {...props} />
    }
    
    export function Scrollbar({ariaControls, ariaValuenow, ...rest}: ScrollbarProps) {
      return <div role="scrollbar" aria-controls={ariaControls} aria-valuenow={ariaValuenow} {...rest} />;
    }
    
    
    export function Search(props: ARIAProps) {
      return <form role="search" {...props} />;
    }
    
    export function SearchBox(props: InputProps) {
      return <input type="text" role="searchbox" {...props} />;
    }
    
    export function Separator(props: ARIAProps) {
      return <hr {...props} />;
    }
    
    export function Slider(props: InputProps) {
      return <input type="range" {...props} />;
    }
    
    export function SpinButton(props: InputProps) {
      return <input type="number" role="spinbutton" {...props} />;
    }
    
    export function Status(props: ARIAProps) {
      return <div role="status" {...props} />;
    }
    
    export function Switch(props: InputProps) {
      return <input type="checkbox" role="switch" {...props} />;
    }
    
    export function Tab(props: ARIAProps) {
      return <button role="tab" {...props} />;
    }
    
    export function Table(props: TableProps) {
      return <table role="table" {...props} />;
    }
    
    export function TableData(props: TableDataProps) {
      return <td {...props} />;
    }
    
    export function TableRow(props: HTMLAttributes<HTMLElement>) {
      return <tr {...props} />;
    }
    
    export function TabList(props: ARIAProps) {
      return <div role="tablist" {...props} />;
    }
    
    export function TabPanel(props: ARIAProps) {
      return <div role="tabpanel" {...props} />;
    }
    
    export function Term(props: ARIAProps) {
      return <DefinitionTerm role="term" {...props} />;
    }
    
    export function TextBox(props: InputProps) {
      return <input type="text" {...props} />;
    }
    
    export function Timer(props: ARIAProps) {
      return <div role="timer" {...props} />;
    }
    
    export function Toolbar(props: ARIAProps) {
      return <div role="toolbar" {...props} />;
    }
    
    export function Tooltip(props: ARIAProps) {
      return <div role="tooltip" {...props} />;
    }
    
    export function Tree(props: ARIAProps) {
      return <ul role="tree" {...props} />;
    }
    
    export function TreeGrid(props: ARIAProps) {
      return <div role="treegrid" {...props} />;
    }
    
    export function TreeItem({ariaSelected, ...rest}: TreeItemProps) {
      return <li aria-selected={ariaSelected} role="treeitem" {...rest} />;
    }
    
    /**
     * DebugDialog component
     * --------------------------------------------------------------------------
     * @param {DialogHTMLAttributes<HTMLDialogElement>} props - The dialog props. 
     * Does not accept any parameters in particular. 
     * @returns {JSX.Element} - The rendered DebugDialog component
     */
    export const DebugDialog: React.FC<DialogHTMLAttributes<HTMLDialogElement>> = (
      { children, style, ...rest }: DialogHTMLAttributes<HTMLDialogElement>
    ): JSX.Element => {
      const [expanded, setExpanded] = useState(true);
      return (
        <dialog open
          style={{
            backgroundColor: "#036",
            fontSize: "12px !important",
            width: expanded ? "calc(30vw - 24px)" : "30px",
            height: expanded ? "90vh" : "30px",
            borderRadius: "12px",
            border: "2px solid #369",
            position: "fixed",
            overflow: "auto",
            top: "12px",
            right: expanded ? "calc(-70vw + 24px)" : "calc(-100vw + 84px)",
            opacity: 0.5
          }}
          aria-labelledby="dialog-title"
          aria-describedby="dialog-description"
          {...rest}>
          <button onClick={() => setExpanded(!expanded)}
            style={{
              backgroundColor: "#FFF",
              borderColor: "#9AD"
            }}>
            {expanded ? '>>' : '<<'}
          </button>
          <div id="dialog-description"
            style={{ color: "#FFF" }}>
            {expanded && children}
          </div>
        </dialog>
      );
    };
    